"use client"

import { Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { PlusMini, MinusMini, Check } from "@medusajs/icons"
import { Button } from "@medusajs/ui"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"

import { addToCart } from "@modules/cart/actions"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/option-select"

import ProductPrice from "../product-price"
import ProductPaymentMethods from "../product-payment-methods"

type ProductActionsProps = {
  product: PricedProduct
  region: Region
  disabled?: boolean
}

export type PriceType = {
  calculated_price: string
  original_price?: string
  price_type?: "sale" | "default"
  percentage_diff?: string
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const countryCode = useParams().countryCode as string

  const variants = product.variants

  // initialize the option state
  useEffect(() => {
    const optionObj: Record<string, string> = {}

    for (const option of product.options || []) {
      Object.assign(optionObj, { [option.id]: undefined })
    }

    setOptions(optionObj)
  }, [product])

  // memoized record of the product's variants
  const variantRecord = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}

    for (const variant of variants) {
      if (!variant.options || !variant.id) continue

      const temp: Record<string, string> = {}

      for (const option of variant.options) {
        temp[option.option_id] = option.value
      }

      map[variant.id] = temp
    }

    return map
  }, [variants])

  // memoized function to check if the current options are a valid variant
  const variant = useMemo(() => {
    let variantId: string | undefined = undefined

    for (const key of Object.keys(variantRecord)) {
      if (isEqual(variantRecord[key], options)) {
        variantId = key
      }
    }

    return variants.find((v) => v.id === variantId)
  }, [options, variantRecord, variants])

  // if product only has one variant, then select it
  useEffect(() => {
    if (variants.length === 1 && variants[0].id) {
      setOptions(variantRecord[variants[0].id])
    }
  }, [variants, variantRecord])

  // update the options when a variant is selected
  const updateOptions = (update: Record<string, string>) => {
    setOptions({ ...options, ...update })
  }

  // check if the selected variant is in stock
  const inStock = useMemo(() => {
    // If we don't manage inventory, we can always add to cart
    if (variant && !variant.manage_inventory) {
      return true
    }

    // If we allow back orders on the variant, we can add to cart
    if (variant && variant.allow_backorder) {
      return true
    }

    // If there is inventory available, we can add to cart
    if (variant?.inventory_quantity && variant.inventory_quantity > 0) {
      return true
    }

    // Otherwise, we can't add to cart
    return false
  }, [variant])

  const actionsRef = useRef<HTMLDivElement>(null)

  // add the selected variant to the cart
  const handleAddToCart = async () => {
    if (!variant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: variant.id,
      quantity,
      countryCode,
    })

    setQuantity(0)
    setIsAdding(false)
  }

  const handleChangeQuantity = (mode: "increase" | "decrease") => {
    if (mode === "increase") {
      setQuantity(quantity + 1)
    } else if (quantity > 0) {
      setQuantity(quantity - 1)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={updateOptions}
                      title={option.title}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={variant} region={region} />
        {/* Move to separate component */}
        <div className="flex items-center gap-4">
          {inStock ? (
            <span className="rounded-full bg-green-600 text-white p-1 px-2 self-start text-sm font-bold flex-shrink-0">
              In Stock
            </span>
          ) : (
            <span className="rounded-full bg-red-600 text-white p-1 px-2 self-start text-sm font-bold flex-shrink-0">
              Out of Stock
            </span>
          )}
          <span className="text-sm text-[#2a647d] font-bold">
            Leaves warehouse in 1 day
          </span>
        </div>
        <div className="flex gap-4 mt-2">
          <div className="flex gap-5 items-center p-2 border rounded-full">
            <div
              className="text-2xl font-bold leading-3 cursor-pointer"
              onClick={() => handleChangeQuantity("decrease")}
            >
              <MinusMini />
            </div>
            <div>{quantity}</div>
            <div
              className="text-3xl font-bold leading-3 cursor-pointer"
              onClick={() => handleChangeQuantity("increase")}
            >
              <PlusMini />
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={
              !inStock || !variant || !!disabled || isAdding || !quantity
            }
            variant="transparent"
            className="w-full h-10 rounded-full bg-[#2a647d] text-white uppercase hover:bg-[#2d7696]"
            isLoading={isAdding}
            data-testid="add-product-button"
          >
            {!variant
              ? "Select variant"
              : !inStock
              ? "Out of stock"
              : "Add to cart"}
          </Button>
        </div>
        {/* Move to separate component */}
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex gap-2 items-center">
            <Check className="text-green-600" />
            <span className="font-bold text-xs">Best Price Guarantee</span>
          </div>
          <div className="flex gap-2 items-center">
            <Check className="text-green-600" />
            <span className="font-bold text-xs">24/7 Customer Care</span>
          </div>
          <div className="flex gap-2 items-center">
            <Check className="text-green-600" />
            <span className="font-bold text-xs">Fast Local Delivery</span>
          </div>
        </div>

        <ProductPaymentMethods />
      </div>
    </>
  )
}
