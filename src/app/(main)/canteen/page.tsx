
'use client';
import { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allCanteenItems } from "@/lib/data";
import { Plus, Minus, ShoppingCart, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { placeOrder, type OrderState } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

type CanteenItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  dataAiHint: string;
};

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing order...
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Confirm and Place Order
                </>
            )}
        </Button>
    );
}

function CanteenItemCard({ item, cart, updateCart }: { item: CanteenItem, cart: CartItem[], updateCart: (item: CanteenItem, quantity: number) => void }) {
  const cartItem = cart.find(ci => ci.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <Card className="overflow-hidden">
      <Image src={item.image} alt={item.name} width={200} height={200} className="w-full h-32 object-cover" data-ai-hint={item.dataAiHint} />
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{item.name}</h3>
        <p className="text-muted-foreground">₹{item.price}</p>
      </CardContent>
      <CardFooter className="p-2">
        {quantity > 0 ? (
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCart(item, quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateCart(item, quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button className="w-full" variant="outline" onClick={() => updateCart(item, 1)}>
            Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


export default function CanteenPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);

  const initialState: OrderState = { message: '', success: false };
  const [state, dispatch] = useActionState(placeOrder, initialState);
  
  const handleUpdateCart = (itemToUpdate: CanteenItem | CartItem, newQuantity: number) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === itemToUpdate.id);
  
      if (newQuantity <= 0) {
        // Remove item from cart
        return currentCart.filter(item => item.id !== itemToUpdate.id);
      }
  
      if (existingItem) {
        // Update quantity of existing item
        return currentCart.map(item =>
          item.id === itemToUpdate.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: itemToUpdate.id,
          name: itemToUpdate.name,
          price: itemToUpdate.price,
          quantity: newQuantity,
        };
        return [...currentCart, newItem];
      }
    });
  };

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Order Placed!',
          description: state.message,
        });
        setCart([]); // Clear the cart on successful order
        formRef.current?.reset();
        sheetCloseRef.current?.click(); // Close the cart sheet
      } else {
         toast({
          variant: 'destructive',
          title: 'Error Placing Order',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartIsEmpty = cart.length === 0;

  const renderCanteenItems = (items: CanteenItem[]) => (
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(item => <CanteenItemCard key={item.id} item={item} cart={cart} updateCart={handleUpdateCart} />)}
      </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Canteen</h1>
      <Tabs defaultValue="snacks">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
          <TabsTrigger value="drinks">Drinks</TabsTrigger>
          <TabsTrigger value="meals">Meals</TabsTrigger>
        </TabsList>
        <TabsContent value="snacks">
          {renderCanteenItems(allCanteenItems.snacks)}
        </TabsContent>
        <TabsContent value="drinks">
           {renderCanteenItems(allCanteenItems.drinks)}
        </TabsContent>
        <TabsContent value="meals">
           {renderCanteenItems(allCanteenItems.meals)}
        </TabsContent>
      </Tabs>

      {!cartIsEmpty && (
         <Sheet>
            <SheetTrigger asChild>
                <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:relative p-4">
                  <div className="md:max-w-4xl mx-auto">
                    <Card className="bg-primary text-primary-foreground shadow-2xl cursor-pointer hover:bg-primary/90 transition-colors">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{totalItems} items | ₹{totalPrice}</p>
                          <p className="text-sm opacity-80">Tap to view your cart and checkout</p>
                        </div>
                        <Button variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                           <ShoppingCart className="mr-2 h-4 w-4" /> View Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Your Order</SheetTitle>
                    <SheetDescription>Review your items before placing the order.</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateCart(item, item.quantity - 1)}><Minus className="h-4 w-4" /></Button>
                                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateCart(item, item.quantity + 1)}><Plus className="h-4 w-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleUpdateCart(item, 0)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <SheetFooter className="mt-auto">
                    <div className="w-full space-y-4">
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{totalPrice}</span>
                        </div>
                        <form action={dispatch} ref={formRef} className="w-full">
                            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                            <input type="hidden" name="totalPrice" value={totalPrice} />
                            <SubmitButton />
                        </form>
                    </div>
                </SheetFooter>
                <SheetClose ref={sheetCloseRef} />
            </SheetContent>
         </Sheet>
      )}
    </div>
  );
}
