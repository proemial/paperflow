import { Session, handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import { QStash } from 'data/adapters/qstash/qstash-client'

export const GET = handleAuth({
  onError(req: Request, error: Error) {
    console.error(error);
  },

  callback: handleCallback({
    afterCallback: (req: NextRequest, session: Session, state?: { [key: string]: any }) => {
      const { sub: id } = session.user;
      const info = extractUserInfo(session);

      QStash.postEvent('user', {
        event: 'login',
        id, info
    });
      return session;
    }
  }),
});

function extractUserInfo(session: Session) {
  const {name, nickname, picture} = session.user;
  const email = session.user['https://paperflow.ai/email'] as string | undefined;
  const domain = email?.substring(email.indexOf('@') +1);

  const organisations = ['paperflow.ai'];
  const org = organisations.includes(domain) && domain;

  return { name, nickname, picture, email, org };
}
