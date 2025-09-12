
'use client';
import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { allCanteenItems } from "@/lib/data";
import { Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import Image from "next/image";
import { placeOrder, type OrderState } from './actions';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

function CanteenItemCard({ item, cart, addToCart }: { item: { id: number; name: string; price: number; image: string; dataAiHint: string }, cart: CartItem[], addToCart: (item: any) => void }) {
  const cartItem = cart.find(ci => ci.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleUpdateQuantity = (newQuantity: number) => {
    addToCart({ ...item, quantity: newQuantity });
  };
  
  const handleInitialAdd = () => {
    handleUpdateQuantity(1);
  };

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
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-bold text-lg">{quantity}</span>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleUpdateQuantity(quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button className="w-full" variant="outline" onClick={handleInitialAdd}>
            Add
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing order...
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Checkout
                </>
            )}
        </Button>
    )
}


export default function CanteenPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: OrderState = { message: null, errors: null };
  const [state, dispatch] = useActionState(placeOrder, initialState);
  
  const handleAddToCart = (itemToAdd: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemToAdd.id);
      if (itemToAdd.quantity === 0) {
        return prevCart.filter(item => item.id !== itemToAdd.id);
      }
      if (existingItem) {
        return prevCart.map(item =>
          item.id === itemToAdd.id ? { ...item, quantity: itemToAdd.quantity } : item
        );
      } else {
        return [...prevCart, itemToAdd];
      }
    });
  };

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Error placing order',
          description: state.message,
        });
      } else {
        toast({
          title: 'Order Placed!',
          description: state.message,
        });
        setCart([]); // Clear the cart on successful order
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCanteenItems.snacks.map(item => <CanteenItemCard key={item.id} item={item} cart={cart} addToCart={handleAddToCart} />)}
          </div>
        </TabsContent>
        <TabsContent value="drinks">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCanteenItems.drinks.map(item => <CanteenItemCard key={item.id} item={item} cart={cart} addToCart={handleAddToCart} />)}
          </div>
        </TabsContent>
        <TabsContent value="meals">
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCanteenItems.meals.map(item => <CanteenItemCard key={item.id} item={item} cart={cart} addToCart={handleAddToCart} />)}
          </div>
        </TabsContent>
      </Tabs>

      {totalItems > 0 && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:relative p-4">
          <div className="md:max-w-4xl mx-auto">
            <Card className="bg-primary text-primary-foreground shadow-2xl">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{totalItems} items | ₹{totalPrice}</p>
                  <p className="text-sm opacity-80">Ready to checkout?</p>
                </div>
                 <form action={dispatch} ref={formRef}>
                    <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                    <input type="hidden" name="totalPrice" value={totalPrice} />
                    <SubmitButton />
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
