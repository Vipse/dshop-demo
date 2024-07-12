import {
  PricedProduct,
  PricedVariant,
} from "@medusajs/medusa/dist/types/pricing"

import { getProductPrice } from "@lib/util/get-product-price"
import { RegionInfo } from "types/global"

export default function ProductPrice({
  product,
  variant,
  region,
}: {
  product: PricedProduct
  variant?: PricedVariant
  region: RegionInfo
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
    region,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  return (
    <div className="flex flex-col text-ui-fg-base">
      {selectedPrice.price_type === "sale" && (
        <>
          <p className="line-through text-gray-400 text-sm">
            <span>Was </span>
            <span
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <p className="text-gray-400 text-base mt-2">Don't pay (?)</p>
          <div className="flex my-4 items-center">
            <div
              className="
               bg-red-700
                h-10
                mr-8
                pl-4
                pr-2
                leading-10
                inline-block
                text-2xl
                relative
                after:content-['']
                text-white
                font-bold
                after:border-l-[20px]
                after:border-t-[20px]
                after:border-b-[20px]
                after:border-l-red-700
                after:border-t-transparent
                after:border-b-transparent
                after:inline-block
                after:absolute
                after:-right-5
                after:top-0
              "
            >
              {selectedPrice.calculated_price}
            </div>
            <div className="flex flex-col items-center font-bold">
              <span>SAVE</span>
              <span>{selectedPrice.percentage_diff}%</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
