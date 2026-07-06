export const sortAnnouncements = (announcements: any[]) => {
  if (!announcements) return [];
  
  const priorityWeight: Record<string, number> = {
    'Urgent': 3,
    'High Priority': 2,
    'Standard Information': 1,
  };

  return [...announcements].sort((a, b) => {
    const weightA = priorityWeight[a.priority] || 0;
    const weightB = priorityWeight[b.priority] || 0;

    if (weightA !== weightB) {
      return weightB - weightA; // Higher priority first
    }

    // Secondary sort: Newest first (using ID as a proxy for created_at since it's sequential)
    return b.id - a.id;
  });
};
