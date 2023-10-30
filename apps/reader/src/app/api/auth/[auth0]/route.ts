import {handleAuth, handleCallback, Session} from '@auth0/nextjs-auth0';
import {NextRequest} from 'next/server';
import {QStash} from 'data/adapters/qstash/qstash-client'
import base64url from "base64url";
import {Env} from "data/adapters/env";

export const GET = handleAuth({
  onError(req: Request, error: Error) {
    console.error(error);
  },

  callback: handleCallback({
    afterCallback: (req: NextRequest, session: Session, state?: { [key: string]: any }) => {
      if(Env.isProd) {
        const { sub: id } = session.user;
        const info = extractUserInfo(session);
        const waitlistEmail = getEmailFromToken(state.returnTo);

        QStash.postEvent('user', {
          event: 'login',
          id, info, waitlistEmail
        });
      }
      return session;
    }
  }),
});

function extractUserInfo(session: Session) {
  const {name, nickname, picture} = session.user;
  const email = session.user['https://paperflow.ai/email'] as string | undefined;
  const domain = email?.substring(email.indexOf('@') +1);

  const organisations = ['paperflow.ai'];
  const org = organisations.includes(domain) ? domain : undefined;

  return { name, nickname, picture, email, org };
}

function getEmailFromToken(returnTo?: string) {
  if(returnTo?.includes('token=')) {
    const url = new URL(returnTo)
    return base64url.decode(url.searchParams.get('token'));
  }
  return undefined;
}
