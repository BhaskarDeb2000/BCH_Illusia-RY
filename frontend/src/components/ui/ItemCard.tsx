
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Info, Check, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import { DBItem } from '@/integrations/supabase/items';
import { useTranslation } from '@/i18n';

interface ItemCardProps {
  item: DBItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const [isAdded, setIsAdded] = useState(false);
  const { t, lang } = useTranslation();

  const handleAddToCart = () => {
    setIsAdded(true);
    toast.success(t('common.add'), {
      description: `${item.name[lang] || item.name['en']} ${t('common.add')} ${t('common.cart')}.`,
      action: {
        label: t('common.viewCart'),
        onClick: () => console.log('Cart clicked')
      },
    });
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <Card className="overflow-hidden card-hover h-full flex flex-col">
      <div className="relative aspect-square">
        <img
          src={item.image_url || '/placeholder.svg'}
          alt={item.name[lang] || item.name['en']}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        {item.quantity <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge className="bg-destructive text-white text-lg font-medium px-3 py-1.5">
              {t('common.outOfStock')}
            </Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className="bg-illusia-purple text-white">{item.category}</Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg line-clamp-1">{item.name[lang] || item.name['en']}</h3>
          <span className="text-sm text-muted-foreground">
            {item.quantity > 0 ? `${item.quantity} ${t("item.quantity")}` : t('common.outOfStock')}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {item.description[lang] || item.description['en']}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          {item.tags && item.tags.length > 0 ? (
            <>
              {item.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {item.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{item.tags.length - 3}
                </Badge>
              )}
            </>
          ) : null}
        </div>
        
        <div className="space-y-1 mt-2">
          {item.storage_details && item.storage_details[lang] && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Package className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{item.storage_details[lang]}</span>
            </div>
          )}
          
          {item.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          asChild
        >
          <Link to={`/items/${item.id}`}>
            <Info className="h-4 w-4 mr-1" />
            {t('common.details')}
          </Link>
        </Button>
        <Button
          size="sm"
          className={`flex-1 ${
            isAdded ? 'bg-green-600 hover:bg-green-700' : 'bg-illusia-purple hover:bg-illusia-purple-dark'
          }`}
          disabled={item.quantity <= 0 || isAdded}
          onClick={handleAddToCart}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              {t('common.add')}
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1" />
              {item.quantity > 0 ? t('common.add') : t('common.outOfStock')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;
