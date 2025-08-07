export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <a href="/" className="logo">Living Dead</a>
      </div>
      <div className="nav-right">
        <a href="/shop">Shop</a>
        <a href="/custom">Custom</a>
        <a href="/about">About</a>
        <a href="/cart">🛒</a>
      </div>
    </nav>
  );
}
