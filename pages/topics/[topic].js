import Layout from 'layouts/page';
import Topics from 'pages/topics';

const topics = ['biodiversity', 'climate', 'commodities', 'water', 'fires'];

const topicsMeta = {
  biodiversity: {
    title:
      'Effects of Forests on Biodiversity | Deforestation & Biodiversity Loss | GFW',
    description:
      'Explore the relationship between forests and biodiversity, why biodiversity is important, and what the effects of deforestation and climate change are on the ecosystem and wildlife. Learn how forest protection offers a solution to biodiversity loss.',
  },
  climate: {
    title:
      'How Forests Affect the Climate | Deforestation & Climate Change | GFW',
    description:
      'Explore the relationship between forests and climate and how deforestation contributes to global warming. Learn how forests can be a natural solution for climate change.',
  },
  commodities: {
    title:
      'Impact of Supply Chains on Forest Resources | Deforestation & Commodities | GFW',
    description:
      'Explore the relationship between forests and commodities, and ways companies can achieve deforestation-free commodity production in their supply chains.',
  },
  water: {
    title: 'Watershed Health | Effects of Deforestation & Climate Change | GFW',
    description:
      'Explore the relationship between forests and water, why deforestation compromises watershed health and the effects of climate change on water resources. Learn about sustainable watershed management and ways forests can help protect against natural disasters.',
  },
  fires: {
    title:
      'Forest Fires & Climate Change | Effects of Deforestation on Wildfires | GFW',
    description:
      'Explore the relationship between forests and fires, the effect of climate change on wildfires and how protection against deforestation can help prevent forest fires.',
  },
};

export const getStaticPaths = async () => {
  const paths = topics.map((key) => ({
    params: { topic: key },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => ({
  props: topicsMeta[params?.topic],
});

const TopicPage = (props) => {
  return (
    <Layout {...props} showFooter={false}>
      <Topics />
    </Layout>
  );
};

export default TopicPage;
