import { dehydrate, QueryClient } from "@tanstack/react-query";

interface PrefetchItem {
  queryKey: readonly unknown[];
  queryFn: () => Promise<unknown>;
}

export async function prefetch(items: PrefetchItem[]) {
  const client = new QueryClient();
  await Promise.all(items.map((item) => client.prefetchQuery(item)));
  return dehydrate(client);
}
