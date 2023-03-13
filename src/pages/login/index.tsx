import { useEffect } from 'react';
import { auth, signInWithGoogle, signInWithGithub } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import withAnimation from '../../HOC/withAnimation';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from 'src/components/Header/Header';
import LoginButton from 'src/components/LoginButton/LoginButton';

function LoginPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, loading]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="container px-4 m-auto text-center md:px-8">
        <Header>Sign in</Header>
        <div className="flex flex-col justify-center items-center space-y-2">
          <LoginButton image={'/google.svg'} onClick={signInWithGoogle}>
            Sign in with Google
          </LoginButton>
          <LoginButton image={'/github.svg'} onClick={signInWithGithub}>
            Sign in with Github
          </LoginButton>
        </div>
        {loading && (
          <div className="text-sm text-center text-zinc-600">Loading...</div>
        )}
        {error && (
          <div className="text-sm text-center text-red-600">
            Error: {error.message}
          </div>
        )}
      </div>
    </>
  );
}

export default withAnimation(LoginPage);
