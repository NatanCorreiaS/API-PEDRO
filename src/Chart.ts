export default class Chart {
  // Properties
  private id: Number;
  private productName: String;
  private price: Number;
  private quantity: Number;

  // Constructor
  constructor(
    id: Number,
    productName: String,
    price: Number,
    quantity: Number
  ) {
    this.id = id;
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
  }

  // Formatted data method
  public getProduct(): String {
    return `ID: ${this.id}, Product Name: ${this.productName}, Price: ${this.price}, Quantity: ${this.quantity}`;
  }

  // Getters and Setters
  public getId(): Number {
    return this.id;
  }

  public setId(id: Number): void {
    this.id = id;
  }

  public getProductName(): String {
    return this.productName;
  }

  public setProductName(productName: String): void {
    this.productName = productName;
  }

  public getPrice(): Number {
    return this.price;
  }

  public setPrice(price: Number): void {
    this.price = price;
  }

  public getQuantity(): Number {
    return this.quantity;
  }

  public setQuantity(quantity: Number): void {
    this.quantity = quantity;
  }
}
