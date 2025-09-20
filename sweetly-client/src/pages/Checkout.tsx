import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Lable";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: string;
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "cod",
  });

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const steps = [
    { id: 1, title: "Delivery Details", icon: "🚚" },
    { id: 2, title: "Payment Method", icon: "💳" },
    { id: 3, title: "Review & Confirm", icon: "✅" },
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cart.map((item) => ({
          sweetId: item.sweetId,
          sweetName: item.sweetName,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
        deliveryFee: deliveryFee,
        finalAmount: total,
        deliveryDetails: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        },
        paymentMethod: formData.paymentMethod,
      };

      // Create order via API
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to create order";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (err) {
          console.log(err);
          // If response is not JSON, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      await response.json();

      // Clear cart and show success
      clearCart();
      (window as any).appToast?.("Order placed successfully! 🎉", "success");
      navigate("/");
    } catch (error) {
      console.error("Order creation failed:", error);
      (window as any).appToast?.(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              🛒
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-600 mb-6">
              Add some delicious sweets to your cart first!
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            🪔 Checkout
          </h1>
          <p className="text-lg text-slate-600">
            Complete your Diwali sweets order
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: currentStep >= step.id ? 1.1 : 0.8,
                      opacity: currentStep >= step.id ? 1 : 0.6,
                    }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg"
                        : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <span className="font-medium">{step.title}</span>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 transition-colors duration-300 ${
                        currentStep > step.id ? "bg-amber-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Delivery Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="text-2xl">🚚</span>
                        <span>Delivery Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Phone Number</Label>
                          <Input
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>
                        <div>
                          <Label>City</Label>
                          <Input
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            placeholder="Enter your city"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Address</Label>
                        <Input
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          placeholder="Enter your complete address"
                          required
                        />
                      </div>
                      <div>
                        <Label>Pincode</Label>
                        <Input
                          value={formData.pincode}
                          onChange={(e) =>
                            handleInputChange("pincode", e.target.value)
                          }
                          placeholder="Enter your pincode"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="text-2xl">💳</span>
                        <span>Payment Method</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            id: "cod",
                            label: "Cash on Delivery",
                            icon: "💰",
                            desc: "Pay when your order arrives",
                          },
                          {
                            id: "upi",
                            label: "UPI Payment",
                            icon: "📱",
                            desc: "Pay using UPI apps",
                          },
                          {
                            id: "card",
                            label: "Credit/Debit Card",
                            icon: "💳",
                            desc: "Pay using your card",
                          },
                        ].map((method) => (
                          <motion.label
                            key={method.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              formData.paymentMethod === method.id
                                ? "border-amber-500 bg-amber-50"
                                : "border-slate-200 hover:border-amber-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={formData.paymentMethod === method.id}
                              onChange={(e) =>
                                handleInputChange(
                                  "paymentMethod",
                                  e.target.value
                                )
                              }
                              className="sr-only"
                            />
                            <span className="text-2xl mr-4">{method.icon}</span>
                            <div>
                              <div className="font-semibold text-slate-900">
                                {method.label}
                              </div>
                              <div className="text-sm text-slate-600">
                                {method.desc}
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="text-2xl">✅</span>
                        <span>Review Your Order</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Delivery Details */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">
                          Delivery Details
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                          <p>
                            <strong>Name:</strong> {formData.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {formData.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {formData.phone}
                          </p>
                          <p>
                            <strong>Address:</strong> {formData.address}
                          </p>
                          <p>
                            <strong>City:</strong> {formData.city} -{" "}
                            {formData.pincode}
                          </p>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">
                          Payment Method
                        </h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                          <p>
                            <strong>Method:</strong>{" "}
                            {formData.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : formData.paymentMethod === "upi"
                              ? "UPI Payment"
                              : "Credit/Debit Card"}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">
                          Order Items
                        </h3>
                        <div className="space-y-3">
                          {cart.map((item) => (
                            <motion.div
                              key={item.sweetId}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex justify-between items-center p-3 bg-slate-50 rounded-lg"
                            >
                              <div>
                                <span className="font-medium">
                                  {item.sweetName}
                                </span>
                                <span className="text-slate-600 ml-2">
                                  x{item.quantity}
                                </span>
                              </div>
                              <span className="font-semibold">
                                ₹{item.price * item.quantity}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between"
            >
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                variant="secondary"
                className="px-8"
              >
                Previous
              </Button>
              {currentStep < 3 ? (
                <Button onClick={handleNext} className="px-8">
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>
              )}
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="text-2xl">📋</span>
                  <span>Order Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.sweetId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex justify-between items-center py-2 border-b border-slate-100"
                  >
                    <div>
                      <span className="font-medium text-slate-900">
                        {item.sweetName}
                      </span>
                      <span className="text-slate-600 text-sm ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </motion.div>
                ))}

                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {subtotal > 500 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm text-green-600 font-medium"
                    >
                      🎉 Free delivery on orders above ₹500!
                    </motion.div>
                  )}
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
