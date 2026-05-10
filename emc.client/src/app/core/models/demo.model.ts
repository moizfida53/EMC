export interface DemoItem {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Pending' | 'Completed' | string;
  createdOn: string;
}

export interface DemoPing {
  message: string;
  serverTimeUtc: string;
  authenticatedUser: string | null;
}
