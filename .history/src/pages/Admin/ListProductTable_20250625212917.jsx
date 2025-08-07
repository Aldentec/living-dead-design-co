import { useEffect, useState } from 'react';

export default function ListProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items')
      .then((res) => res.json())
      .then((data) => {
        const parsedBody = JSON.parse(data.body); // 👈 unwrap and parse
        setProducts(Array.isArray(parsedBody) ? parsedBody : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <table className="table table-dark table-striped">
      <thead>
        <tr>
          <th>Preview</th>
          <th>Title</th>
          <th>Description</th>
          <th>Price</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        {products.map((item) => (
          <tr key={item.id}>
            <td>
              <img src={item.imageUrl} alt={item.title} width="60" height="60" />
            </td>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>${item.price}</td>
            <td>{item.tags?.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
