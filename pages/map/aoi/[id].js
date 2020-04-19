import PropTypes from 'prop-types';

import { getArea } from 'services/areas';
import { getGeodescriber } from 'services/geostore';

import Layout from 'layouts/page';

import ConfirmationMessage from 'components/confirmation-message';

export const getServerSideProps = async ({ params }) => {
  try {
    const area = await getArea(params.id);
    const { name } = area;

    const props = {
      props: {
        name,
        area,
        titleParams: {
          locationName: name,
        },
      },
    };
    if (!name) {
      try {
        const geodescriber = await getGeodescriber(area);
        const { title } = geodescriber?.data?.data;

        return {
          props: {
            name: title || name,
            area,
            titleParams: {
              locationName: title || name,
            },
          },
        };
      } catch (err) {
        return props;
      }
    } else {
      return props;
    }
  } catch (err) {
    return {
      props: {
        title: 'Area not found',
      },
    };
  }
};

const DashboardsPage = (props) => {
  return (
    <Layout {...props}>
      {props.title === 'Area not found' ? (
        <ConfirmationMessage
          title="Area not found"
          description="It might have been deleted or the id is incorrect"
          error
        />
      ) : (
        props.name
      )}
    </Layout>
  );
};

DashboardsPage.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
};

export default DashboardsPage;
