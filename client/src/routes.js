import HomePage from './pages/home.vue';
import AboutPage from './pages/about.vue';
import FormPage from './pages/form.vue';
import DynamicRoutePage from './pages/dynamic-route.vue';
import NotFoundPage from './pages/not-found.vue';

import PanelLeftPage from './pages/panel-left.vue';
import PanelRightPage from './pages/panel-right.vue';

import friends from './pages/friends';
import games from './pages/games';
import editFriends from './pages/editFriends';
import editGame from './pages/editGame';
import selectUser from './pages/selectUser';
import personGame from './pages/personGames';

import infoPage from './pages/info';
import  personGamesByMonth from './pages/personGamesByMonth';

export default [
  {
    path: '/',
    component: HomePage,
    tabs: [
      {
        path: '/',
        id: 'tab1',
        component: infoPage,
      }, {
        path: '/tab2/',
        id: 'tab2',
        component: friends,
      }, {
        path: '/tab3/',
        id: 'tab3',
        component: games,
      },
    ],
  }, {
    path: '/panel-left/',
    component: PanelLeftPage,
  }, {
    path: '/editFriends/',
    component: editFriends,
  }, {
    path: '/editGame/',
    component: editGame,
  }, {
    path: '/selectUser/',
    component: selectUser,
  }, {
    path: '/personGame/',
    component: personGame,
  }, {
    path: '/personGamesByMonth/',
    component: personGamesByMonth,
  }, {
    path: '/about/',
    component: AboutPage,
  }, {
    path: '(.*)',
    component: NotFoundPage,
  },
];
