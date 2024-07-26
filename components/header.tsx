import Link from "next/link";

const Header = () => {
  /* TODO: Header */
  return (
    <header className='flex p-4 gap-4'>
      <Link href='/'>[App Name]</Link>
      <Link href='/upload'>Upload</Link>
    </header>
  );
};

export default Header;
