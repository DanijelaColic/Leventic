import CheckoutForm from './CheckoutForm'

export default function CheckoutContent() {
  const handleOrderComplete = (id: string) => {
    // Direktno redirectaj na order confirmation stranicu s orderID parametrom
    console.log('CheckoutContent: Redirecting to order confirmation with orderId:', id)
    window.location.href = `/order-confirmation?orderId=${id}`
  }

  return <CheckoutForm onOrderComplete={handleOrderComplete} />
}

