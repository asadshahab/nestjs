import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { User } from './auth.entity';

import { HashPassword } from '../common/hash-password';
// import { HashPassword } from './hash-password';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    // hash passwords
    const hashedPassword = await HashPassword.hash(event.entity.password);
    event.entity.password = hashedPassword;
  }
}
