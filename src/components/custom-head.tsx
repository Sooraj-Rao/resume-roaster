import Head from "next/head";

interface CustomHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
}

const CustomHead: React.FC<CustomHeadProps> = ({
  title,
  description,
  canonicalUrl,
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
};

export default CustomHead;
