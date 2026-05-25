import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Convert base64 VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications(userId) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Replace this with the actual public key you generate
  const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking push subscription:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    } else {
      setLoading(false);
    }
  }, []);

  const subscribe = async () => {
    if (!VAPID_PUBLIC_KEY) {
      console.error('Missing VAPID Public Key in env');
      return false;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Ask for permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // If a subscription already exists for this browser, it might belong to a DIFFERENT user_id 
      // (e.g. if they logged out and logged into a newly claimed Tee account).
      // Since Supabase RLS prevents us from overwriting another user's subscription,
      // we must force the browser to unsubscribe first, which generates a fresh, unique endpoint.
      let existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      // Subscribe to PushManager with a fresh endpoint
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Save to Supabase
      const subscriptionData = subscription.toJSON();
      
      const { error } = await supabase.from('user_push_subscriptions').upsert({
        user_id: userId,
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth_key: subscriptionData.keys.auth
      }, { onConflict: 'endpoint' });

      if (error) throw error;

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        // Delete from Supabase first
        await supabase
          .from('user_push_subscriptions')
          .delete()
          .eq('endpoint', subscription.endpoint);
        
        // Unsubscribe from browser
        await subscription.unsubscribe();
      }
      setIsSubscribed(false);
    } catch (err) {
      console.error('Error unsubscribing:', err);
    }
    setLoading(false);
  };

  return { isSupported, isSubscribed, loading, subscribe, unsubscribe };
}
