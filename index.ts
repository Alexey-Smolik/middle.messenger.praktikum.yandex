import { LoginComponent } from './src/pages/login/login.component';
import { RegistrationComponent } from './src/pages/registration/registration.component';
import { ProfileComponent } from './src/pages/profile/profile.component';
import { ChatsComponent } from './src/pages/chats/chats.component';
import { Router } from './src/routing/router';
import './src/styles/main.scss';

const router = new Router('.app');

router.use('/', LoginComponent, { classForRoot: 'login-wrapper' })
    .use('/sign-up', RegistrationComponent, { classForRoot: 'registration-wrapper' })
    .use('/settings', ProfileComponent, { classForRoot: 'profile-wrapper' })
    .use('/messenger', ChatsComponent, { classForRoot: 'chats-wrapper' })
    .start();

export default router;
