import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { Heading, Text } from "@medusajs/ui"

type ProductInfoProps = {
  product: PricedProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col">
        <Heading
          level="h2"
          className="text-xl leading-6 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        <Text
          className="text-medium text-ui-fg-subtle"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
