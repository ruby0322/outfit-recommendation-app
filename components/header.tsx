import { Shirt } from "lucide-react";
import Link from "next/link";

const Header = () => {
  /* TODO: Header */
  return (
    <header className='flex p-4 gap-4'>
      <Link href='/'>
        <Shirt fill='#111' />
      </Link>
      <Link href='/upload'>推薦</Link>
    </header>
  );
};

export default Header;
