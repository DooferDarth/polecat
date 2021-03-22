import { Application } from '../declarations';
import users from './users/users.service';
import characters from './characters/characters.service';
import messages from './messages/messages.service';
import derivatives from './derivatives/derivatives.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
    app.configure(users);
    app.configure(characters);
    app.configure(messages);
    app.configure(derivatives);
}
