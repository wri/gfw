export const getServerSideProps = async () => {
  const getFakeData = await fetch(
    'https://www.globalforestwatch.org/api/gfw/v2/geostore/admin/IDN/?thresh=0.05'
  );

  const data = await getFakeData.json();

  const parsedData = data.map((d) => d);

  return {
    props: {
      fakeData: parsedData,
    },
  };
};

const ThisIsAnError = (props) => {
  return (
    <div>
      <div>this is an error:</div>
      {/* eslint-disable-next-line react/prop-types */}
      <div>{props.fakeData.data.id.map((d) => d)}</div>
    </div>
  );
};

export default ThisIsAnError;
