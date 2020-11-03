import App from './components/App.jsx';
import Question from './components/Question.jsx';



const routes = [
    {
        component: App,
        routes : [
            {
                path: '/',
                exact: true,
                component: App
            },
            {
                path: '/question',
                component: Question
            },
        ]
    }
];

export default routes;
