import { LoginComponent } from './src/pages/login/login.component';
import { RegistrationComponent } from './src/pages/registration/registration.component';
import { ProfileComponent } from './src/pages/profile/profile.component';
import { ChatsComponent } from './src/pages/chats/chats.component';
import { ClientErrorComponent } from './src/pages/client-error/client-error.component';
import { ServerErrorComponent } from './src/pages/server-error/server-error.component';

const linksContainer = document.getElementById('links');

Array.from(linksContainer.getElementsByClassName('link')).forEach(link => {
  link.addEventListener('click', event => {
    linksContainer.style.display = 'none';
    history.replaceState(null, '', `/${event.target.id}`);

    switch (event.target.id) {
      case 'login-page':
        document.getElementById('app')?.appendChild((new LoginComponent({ classForRoot: 'login-wrapper' })).getContent());
        break;
      case 'registration-page':
        document.getElementById('app')?.appendChild((new RegistrationComponent({ classForRoot: 'registration-wrapper' })).getContent());
        break;
      case 'chats-page':
        document.getElementById('app')?.appendChild((new ChatsComponent({ classForRoot: 'chats-wrapper' })).getContent());
        break;
      case 'profile-page':
        document.getElementById('app')?.appendChild((new ProfileComponent({ classForRoot: 'profile-wrapper' })).getContent());
        break;
      case 'client-error-page':
        document.getElementById('app')?.appendChild((new ClientErrorComponent({ classForRoot: 'client-error-wrapper' })).getContent());
        break;
      case 'server-error-page':
        document.getElementById('app')?.appendChild((new ServerErrorComponent({ classForRoot: 'server-error-wrapper' })).getContent());
        break;
    }
  })
});
