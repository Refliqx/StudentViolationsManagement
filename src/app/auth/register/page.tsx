'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, Check, Loader2, Shield, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!acceptedTerms) {
            alert("You must accept the terms and conditions to register.");
            return;
        }

        if (criteriaCount < 5) {
            alert("Password does not meet all security requirements.");
            return;
        }

        if (!isPasswordMatch) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        name: formData.name,
                    }
                }
            });

            if (error) {
                alert(error.message);
                return;
            }

            alert("Registration successful! Please log in.");
            router.push("/auth/login");
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    const isMinLength = formData.password.length >= 8;
    const hasUppercase = /[A-Z]/.test(formData.password);
    const hasLowercase = /[a-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
    const criteriaCount = [isMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

    const getStrengthDetails = (count: number) => {
        if (!formData.password) return { text: "", color: "", barColor: "bg-gray-200" };
        switch (count) {
            case 1:
                return { text: "Very Weak", color: "text-red-500", barColor: "bg-red-500" };
            case 2:
                return { text: "Weak", color: "text-red-400", barColor: "bg-red-400" };
            case 3:
                return { text: "Medium", color: "text-amber-500", barColor: "bg-amber-500" };
            case 4:
                return { text: "Good", color: "text-blue-500", barColor: "bg-blue-500" };
            case 5:
                return { text: "Strong & Secure!", color: "text-emerald-500", barColor: "bg-emerald-500" };
            default:
                return { text: "Very Weak", color: "text-red-500", barColor: "bg-red-500" };
        }
    }

    const strength = getStrengthDetails(criteriaCount);
    const isPasswordMatch = formData.password && formData.password === formData.confirmPassword;
    const showMatchStatus = formData.confirmPassword.length > 0;
    const isFormValid = acceptedTerms && formData.password && isPasswordMatch && criteriaCount === 5 && !loading;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via white to-blue-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-100 p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 rounded-2xl" />
                    <div className="relative z-10">
                        <a href="/auth/login" className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </a>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500/5 to-blue-600/100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                            <p className="text-gray-600">Join us today! It takes only a few steps.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your full name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Your email address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Your password"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white/70 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            !formData.password 
                                                ? "border-gray-200 focus:ring-blue-500" 
                                                : criteriaCount === 5 
                                                    ? "border-emerald-300 focus:ring-emerald-500 bg-emerald-50/10 focus:border-emerald-500" 
                                                    : "border-gray-200 focus:ring-blue-500"
                                        }`}
                                        required
                                        disabled={loading}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500">
                                        {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {formData.password && (
                                    <div className="space-y-2 mt-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                                        {/* Strength Label and Icon */}
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-1.5 text-gray-500">
                                                {criteriaCount === 5 ? (
                                                    <ShieldCheck className="w-4 h-4 text-emerald-500 animate-pulse" />
                                                ) : (
                                                    <Shield className="w-4 h-4 text-amber-500" />
                                                )}
                                                Strength:
                                            </span>
                                            <span className={`font-semibold ${strength.color}`}>
                                                {strength.text}
                                            </span>
                                        </div>
                                        
                                        {/* Multi-segmented strength bar */}
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((index) => (
                                                <div 
                                                    key={index} 
                                                    className={`h-full flex-1 transition-all duration-300 ${
                                                        index <= criteriaCount ? strength.barColor : 'bg-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Checklist of rules */}
                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-xs">
                                            <div className={`flex items-center gap-1.5 transition-colors duration-200 ${isMinLength ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                                {isMinLength ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                                                )}
                                                <span>Min. 8 characters</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 transition-colors duration-200 ${hasUppercase ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                                {hasUppercase ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                                                )}
                                                <span>1 uppercase (A-Z)</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 transition-colors duration-200 ${hasLowercase ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                                {hasLowercase ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                                                )}
                                                <span>1 lowercase (a-z)</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 transition-colors duration-200 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                                {hasNumber ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                                                )}
                                                <span>1 number (0-9)</span>
                                            </div>
                                            <div className={`flex items-center gap-1.5 transition-colors duration-200 col-span-2 ${hasSpecial ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>
                                                {hasSpecial ? (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                ) : (
                                                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                                                )}
                                                <span>1 special character (e.g. @, #, $, !)</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" htmlFor="confirm-password">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white/70 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            !showMatchStatus 
                                                ? "border-gray-200 focus:ring-blue-500" 
                                                : isPasswordMatch 
                                                    ? "border-emerald-300 focus:ring-emerald-500 bg-emerald-50/10 focus:border-emerald-500" 
                                                    : "border-red-300 focus:ring-red-500 bg-red-50/10 focus:border-red-500"
                                        }`}
                                        required
                                        disabled={loading}
                                    />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500">
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {showMatchStatus && (isPasswordMatch ? (
                                    <div className="text-sm font-medium mt-1 text-emerald-600 flex items-center gap-1">
                                        <Check className="w-4 h-4"/> Passwords match
                                    </div>
                                    ) : (
                                    <div className="text-sm font-medium mt-1 text-red-600 flex items-center gap-1">
                                        Passwords do not match 
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    disabled={loading}
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                     I agree to the terms and conditions
                                </label>
                            </div>

                            <button type="submit" disabled={!isFormValid} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all flex items-center justify-center gap-2">
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Register
                            </button>

                            <div className="text-center">
                                <p className="text-sm text-gray-600 flex justify-center gap-1.5">
                                    Already have an account?
                                    <a href="/auth/login" className="text-blue-600 hover:underline">Sign In</a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}