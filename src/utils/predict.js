import weights from "../data/model_weights.json";

// نفس موديل الـ AI (Logistic Regression) بيتحسب في المتصفح، من غير باك إند
// scale -> مجموع (وزن × قيمة) + intercept -> sigmoid
export function predictSurvival({ age, year, nodes }) {
  const x = [age, year, nodes];
  const { mean, scale } = weights.scaler;
  const z = x.reduce((sum, v, i) => sum + weights.coefficients[i] * ((v - mean[i]) / scale[i]), weights.intercept);
  const survival = (1 / (1 + Math.exp(-z))) * 100;
  const positive = survival >= 50;
  return { positive, confidence: positive ? survival : 100 - survival };
}
