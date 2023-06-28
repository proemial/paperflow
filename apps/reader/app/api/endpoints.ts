export async function fetchRoles(userId: string, token: string) {
    const rolesResponse = await fetch(
        `https://paperflow.eu.auth0.com/api/v2/users/${userId}/roles`,
        {
          headers: {
            authorization:
              `Bearer ${token}`,
          },
        }
      );
      if (rolesResponse.status !== 200) {
        throw new Error(`${rolesResponse.status}, ${rolesResponse.statusText}`)
      }

      return await rolesResponse.json();
}
