import { ObjectId } from "mongodb";

export default class Chart {
  // Properties
  private _id: ObjectId;
  private productName: String;
  private price: Number;
  private quantity: Number;

  // Constructor
  constructor(
    _id: ObjectId,
    productName: String,
    price: Number,
    quantity: Number
  ) {
    this._id = _id;
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
  }

  // Formatted data method
  public getProduct(): String {
    return `ID: ${this._id}, Product Name: ${this.productName}, Price: ${this.price}, Quantity: ${this.quantity}`;
  }

  // Getters and Setters
  public getId(): ObjectId {
    return this._id;
  }

  public setId(_id: ObjectId): void {
    this._id = _id;
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

export class ChartCRUD {
  private productName: String;
  private price: Number;
  private quantity: Number;

  constructor(productName: String, price: Number, quantity: Number) {
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
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
