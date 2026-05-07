-- Peak day of week (returns e.g. 'Thursday')
create or replace function get_peak_scan_day(p_profile_id uuid)
returns text language sql stable as $$
  select to_char(viewed_at at time zone 'Asia/Kolkata', 'Day')
  from profile_view_events
  where profile_id = p_profile_id
  group by 1
  order by count(*) desc
  limit 1;
$$;

-- New city today (first appearance ever)
create or replace function get_new_city_today(p_profile_id uuid)
returns text language sql stable as $$
  select city from qr_scan_events
  where profile_id = p_profile_id
    and city is not null
    and date(scanned_at at time zone 'Asia/Kolkata') = current_date
    and city not in (
      select distinct city from qr_scan_events
      where profile_id = p_profile_id
        and city is not null
        and date(scanned_at at time zone 'Asia/Kolkata') < current_date
    )
  limit 1;
$$;

-- Current consecutive day streak
create or replace function get_current_streak(p_profile_id uuid)
returns int language plpgsql stable as $$
declare
  v_streak int := 0;
  v_check_date date := current_date;
  v_has_scans boolean;
begin
  loop
    select exists(
      select 1 from profile_view_events
      where profile_id = p_profile_id
        and date(viewed_at at time zone 'Asia/Kolkata') = v_check_date
    ) into v_has_scans;
    exit when not v_has_scans;
    v_streak := v_streak + 1;
    v_check_date := v_check_date - 1;
  end loop;
  return v_streak;
end;
$$;
