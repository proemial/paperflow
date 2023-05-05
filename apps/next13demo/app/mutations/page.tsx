import { redirect } from 'next/navigation';

export default function MutationsPage() {
  async function create(formData: FormData) {
    'use server';
    console.log('Running on server!', formData.get('title'), formData.get('content'));

    redirect(`/mutations/${formData.get('title')}`);
  }

  return <div style={{ color: 'white' }}>
    <form action={create}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: 'black' }}>
        <input type="text" name="title" />
        <textarea name="content" />
        <button type="submit" style={{ color: 'white', border: '1px solid white' }}>Submit</button>
      </div>
    </form>
  </div>;
}

// import { revalidateTag } from 'next/cache';

// async function update(formData: FormData) {
//   'use server';
//   await db.post.update({
//     title: formData.get('title'),
//   });
//   revalidateTag('posts');
// }

// export default async function Page() {
//   const res = await fetch('https://...', { next: { tags: ['posts'] } });
//   const data = await res.json();
//   // ...
// }


// export default function MutationsPage() {
//   async function increment() {
//     'use server';
//     console.log('Running on server!');

//   }

//   return <div style={{ color: 'white' }}>
//     <form action={increment}>
//       <button type="submit">Like</button>
//     </form>
//   </div>;
// }
