import { useEffect, useState } from 'react';

export default function ListProductTable() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortKey, setSortKey] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetch('https://nbwke3grerscqtfchrbl6txcti0rgeip.lambda-url.us-west-2.on.aws/items')
      .then((res) => res.json())
      .then((data) => {
        try {
          const parsed = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
          const items = Array.isArray(parsed) ? parsed : [];
          setProducts(items);
          setFilteredProducts(items);
        } catch (err) {
          console.error('Failed to parse response body:', err);
        } finally {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let updated = [...products];

    if (selectedTag) {
      updated = updated.filter(p => Array.isArray(p.tags) && p.tags.includes(selectedTag));
    }

    if (searchTerm) {
      updated = updated.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    updated.sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (['price', 'quantity', 'weight', 'sold'].includes(sortKey)) {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else {
        valA = valA?.toString().toLowerCase() || '';
        valB = valB?.toString().toLowerCase() || '';
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredProducts(updated);
  }, [products, searchTerm, selectedTag, sortKey, sortOrder]);

  const allTags = Array.from(new Set(products.flatMap(p => p.tags || [])));

  if (loading) return <p>Loading...</p>;

  function handleSort(key) {
    if (sortKey === key) {
      // If same key, toggle order
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // If new key, set to asc
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  function renderSortIcon(key) {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? ' ⬆️' : ' ⬇️';
  }

  return (
    <div>
      <div className="mb-3 d-flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by title..."
          className="form-control w-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select w-auto"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products found for your filters.</p>
      ) : (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Preview</th>
              <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                Title{renderSortIcon('title')}
              </th>
              <th>Description</th>
              <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                Price{renderSortIcon('price')}
              </th>
              <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                Quantity{renderSortIcon('quantity')}
              </th>
              <th onClick={() => handleSort('sold')} style={{ cursor: 'pointer' }}>
                Sold{renderSortIcon('sold')}
              </th>
              <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>
                Weight{renderSortIcon('weight')}
              </th>
              <th>Variants</th>
              <th onClick={() => handleSort('weight')} style={{ cursor: 'pointer' }}>Active</th>
              <th>Tags</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    width="60"
                    height="60"
                    onError={(e) => {
                      if (!e.target.dataset.fallback) {
                        e.target.src = '/fallback.jpg';
                        e.target.dataset.fallback = 'true';
                      }
                    }}
                  />
                </td>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>${item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.sold}</td>
                <td>{item.weight} oz</td>
                <td>
                  {Array.isArray(item.variants)
                    ? item.variants.map(v => `${v.option}: ${v.value} (${v.quantity})`).join(' | ')
                    : ''}
                </td>
                <td>{item.isActive ? '✅' : '❌'}</td>
                <td>{Array.isArray(item.tags) ? item.tags.join(', ') : ''}</td>
                <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
