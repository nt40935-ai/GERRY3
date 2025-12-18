import React, { useMemo } from 'react';
import { Combo, Product, Language } from '../../types';
import { formatPrice } from '../../constants';
import { PackagePlus, Sparkles } from 'lucide-react';

interface ComboSectionProps {
  combos: Combo[];
  products: Product[];
  language: Language;
  onAddComboToCart: (combo: Combo) => void;
}

const ComboSection: React.FC<ComboSectionProps> = ({ combos, products, language, onAddComboToCart }) => {
  const activeCombos = useMemo(() => combos.filter(c => c.isActive), [combos]);

  const productMap = useMemo(() => {
    const map = new Map<string, Product>();
    for (const p of products) map.set(p.id, p);
    return map;
  }, [products]);

  if (activeCombos.length === 0) return null;

  return (
    <section id="combos" className="py-12 sm:py-16 bg-gradient-to-b from-coffee-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-800 text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            {language === 'vi' ? 'Combo & Ưu đãi' : 'Combos & Deals'}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-coffee-900 mt-4">
            {language === 'vi' ? 'Combo nổi bật' : 'Featured combos'}
          </h2>
          <p className="text-coffee-600 mt-2">
            {language === 'vi'
              ? 'Chọn combo sẵn để đặt nhanh và tiết kiệm hơn.'
              : 'Pick a combo to order faster and save more.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {activeCombos.map(combo => {
            const lines = combo.items
              .map(it => {
                const p = productMap.get(it.productId);
                return p ? `${it.quantity}x ${p.name}` : `${it.quantity}x ${it.productId}`;
              })
              .slice(0, 3);
            const moreCount = Math.max(0, combo.items.length - lines.length);

            return (
              <div key={combo.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-40 sm:h-44 bg-gradient-to-br from-amber-50 to-orange-50">
                  {combo.image ? (
                    <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-700">
                      <PackagePlus className="w-10 h-10 opacity-60" />
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-lg font-bold text-coffee-900 line-clamp-2">{combo.name}</h3>
                  <p className="text-sm text-coffee-600 mt-1 line-clamp-2">{combo.description}</p>

                  <div className="mt-3 text-sm text-coffee-700 space-y-1">
                    {lines.map((l, idx) => (
                      <div key={idx} className="truncate">
                        - {l}
                      </div>
                    ))}
                    {moreCount > 0 && (
                      <div className="text-xs text-coffee-500 italic">
                        {language === 'vi' ? `+ ${moreCount} món nữa` : `+ ${moreCount} more items`}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xl font-bold text-amber-700">
                      {formatPrice(combo.price, language)}
                    </div>
                    <button
                      type="button"
                      onClick={() => onAddComboToCart(combo)}
                      className="px-4 py-2 rounded-xl bg-coffee-900 text-white font-bold hover:bg-amber-600 transition-colors active:scale-95 touch-manipulation"
                    >
                      {language === 'vi' ? 'Thêm combo' : 'Add combo'}
                    </button>
                  </div>

                  <div className="mt-3 text-xs text-coffee-500">
                    {language === 'vi'
                      ? 'Combo sẽ được thêm vào giỏ hàng dưới dạng 1 mục (bundle).'
                      : 'The combo will be added as one bundled item in your cart.'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComboSection;


