import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';

const ThankyouPage = () => {
  const { t } = useTranslation('thankyou');

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name="description" content={t('content')} />
      </Head>

      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/thankyou.svg"
          alt="thankyou"
          height="200"
          width="160"
        />

        <h1 className="leading-tighter mt-4 text-4xl font-extrabold tracking-tighter">
          {t('firstPartHeading')}&nbsp;
          <span className="text-indigo-200">{t('secondPartHeading')}</span>
        </h1>
        <p className="mt-2 max-w-lg text-lg text-zinc-600">{t('content')}</p>
      </div>
    </>
  );
};

export default ThankyouPage;