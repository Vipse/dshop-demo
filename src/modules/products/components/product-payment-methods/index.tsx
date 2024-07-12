import Image from "next/image"

import visa from "./paymentMethodsAssets/visa.png"
import masterCard from "./paymentMethodsAssets/masterCard.jpg"
import amex from "./paymentMethodsAssets/americanExpress.jpg"
import after from "./paymentMethodsAssets/after.png"
import apple from "./paymentMethodsAssets/apple.jpg"
import google from "./paymentMethodsAssets/google.png"
import zip from "./paymentMethodsAssets/zip.png"

const PAYMENT_METHODS = [
  { src: visa, alt: "visa" },
  { src: masterCard, alt: "masterCard" },
  { src: amex, alt: "amex" },
  { src: after, alt: "after" },
  { src: apple, alt: "apple" },
  { src: google, alt: "google" },
  { src: zip, alt: "zip" },
]

const ProductPaymentMethods = () => {
  return (
    <div className="flex justify-between m mt-1">
      {PAYMENT_METHODS.map((method) => (
        <Image key={method.alt} src={method.src} alt={method.alt} height={20} />
      ))}
    </div>
  )
}

export default ProductPaymentMethods
