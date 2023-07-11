import { getSession } from "@auth0/nextjs-auth0";
import { SplitFactory } from "@splitsoftware/splitio";

const authorizationKey = process.env.SPLIT_API_KEY;
if (!authorizationKey) {
  throw new Error("SPLIT_API_KEY is not defined");
}

const factory: SplitIO.ISDK = SplitFactory({
  core: {
    authorizationKey,
  },
});
const client = factory.client();

export async function getSplits(splitNames: string | string[]) {
  const session = await getSession();
  if(!session) {
    return {};
  }

  await client.ready();
  const { sub, name } = session?.user;

  return client.getTreatments(
    sub,
    Array.isArray(splitNames) ? splitNames : [splitNames],
    {sub, name, foo: 'bar'},
  );
}
