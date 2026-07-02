import { getNextEvent, getUpcomingEvents, ISLAMIC_EVENTS } from '../islamicEvents';

describe('islamicEvents', () => {
  const from = new Date(2026, 6, 2); // 17 Muharram 1448

  it('lists every event exactly once, sorted by proximity', () => {
    const upcoming = getUpcomingEvents(from);
    expect(upcoming).toHaveLength(ISLAMIC_EVENTS.length);
    for (let i = 1; i < upcoming.length; i++) {
      expect(upcoming[i].daysAway).toBeGreaterThanOrEqual(upcoming[i - 1].daysAway);
    }
    expect(new Set(upcoming.map((e) => e.id)).size).toBe(ISLAMIC_EVENTS.length);
  });

  it('never returns past events', () => {
    for (const event of getUpcomingEvents(from)) {
      expect(event.daysAway).toBeGreaterThanOrEqual(0);
    }
  });

  it('next event from 17 Muharram 1448 is Mawlid (12 Rabi I)', () => {
    const next = getNextEvent(from);
    expect(next.id).toBe('mawlid');
    expect(next.nameKey).toBe('occasions.mawlid');
  });
});
