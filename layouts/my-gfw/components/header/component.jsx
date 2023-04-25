import { Row, Column } from '@worldresources/gfw-components';

import UserProfile from '../user-profile';

const MyGfwHeader = () => (
  <div className="c-mygfw-header">
    <Row>
      <Column width={[1, 1 / 2]}>
        <h1>My GFW</h1>
      </Column>
      <Column width={[1, 1 / 2]}>
        <UserProfile />
      </Column>
    </Row>
  </div>
);

export default MyGfwHeader;
