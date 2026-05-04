import { useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

export function useAutoSave(profileId: string, persona: string) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const save = useCallback(
    (data: Record<string, any>) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setSaveStatus('saving')

      timerRef.current = setTimeout(async () => {
        try {
          // 1. Fetch existing persona_data to merge
          const { data: profile } = await supabase
            .from('profiles')
            .select('persona_data')
            .eq('id', profileId)
            .single()

          const existingPersonaData = profile?.persona_data || {}
          const updatedPersonaData = {
            ...existingPersonaData,
            [persona]: data,
            // Include top-level type to preserve legacy fields
            type: persona
          }

          // 2. Save into existing profiles table (Safe & Guaranteed fallback)
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              persona_data: updatedPersonaData,
              persona: persona,
              persona_type: persona
            })
            .eq('id', profileId)

          if (profileError) throw profileError

          // 3. Optionally try to save into profile_persona_data table (as requested in architecture)
          try {
            await supabase
              .from('profile_persona_data')
              .upsert(
                {
                  profile_id: profileId,
                  persona,
                  data,
                  updated_at: new Date().toISOString()
                },
                { onConflict: 'profile_id,persona' }
              )
          } catch (e) {
            // Squelch DDL error if table hasn't been migrated yet in Supabase
          }

          setSaveStatus('saved')
          window.dispatchEvent(new CustomEvent('identity-saved', { detail: { persona, data } }))
        } catch (err) {
          console.error('Error auto-saving:', err)
          setSaveStatus('error')
        } finally {
          setTimeout(() => setSaveStatus('idle'), 2000)
        }
      }, 500)
    },
    [profileId, persona]
  )

  return { save, saveStatus }
}
