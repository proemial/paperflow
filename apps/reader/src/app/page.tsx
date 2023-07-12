import { PaperCard } from "src/components/card";

const papers = [
  {
    text: `Smart environment for cybersecurity training adapts to students' skills, helping them successfully complete the training and enjoy the experience.`,
    category: "Cryptography and Security",
    published: "2023-07-11",
  },
  {
    text: `Deepfake detectors can be easily fooled by Denoising Diffusion Models, reducing their accuracy without noticeable changes.`,
    category: "Computer Vision and Pattern Recognition",
    published: "2023-07-11",
  },
  {
    text: "EgoVLPv2 improves video-language understanding by integrating fusion directly into backbones, enhancing efficiency and achieving state-of-the-art results.",
    category: "Computer Vision and Pattern Recognition",
    published: "2023-07-11",
  },
  {
    text: `Hull dimensions of quasi-cyclic and four-circulant codes are related to generating polynomials. Four-circulant codes have even hull dimensions.`,
    category: "Information Theory",
    published: "2023-07-11",
  },
];

/*
#Cryptography#CodingTheory#Mathematics
Graphs without long paths are hard to analyze. Matching Cut problem complexity increases. Exponential Time Hypothesis holds strong. 2023-07-11
Computational Complexity#Graphs#Matching#Exponential
Audio haptic feedback in driving can be detected outside the range of -75 ms to 110 ms, affecting perception. 2023-07-11
Human-Computer Interaction#MultimodalFeedback#Perception#Driving
Using 3D deep learning, MinkSORT improved accuracy of tracking tomato positions in a greenhouse, enhancing robot efficiency. 2023-07-11
Robotics#MinkSORT#AgroFoodRobotics#WorldModelAccuracy
Using scores instead of preferences boosts interactive reinforcement learning, helping robots learn complex tasks efficiently. 2023-07-11
Robotics#AI#MachineLearning#Robotics
New attention mechanism, One-Versus-Others, scales linearly with modalities, improving multimodal learning while decreasing computation costs. 2023-07-11
Machine Learning#AttentionMechanism#MultimodalLearning#ComputationalEfficiency
New noising scheme based on Metropolis sampling improves computational efficiency and performance of generative modelling on constrained systems. 2023-07-11
Machine Learning#dataanalysis#computerscience#scientificresearch
Teaching a learner using the best observations can help maximize understanding of concepts. 2023-07-11
Machine Learning#Education#Teaching#Learning
Neuromorphic computing allows robotic recognition of hand gestures, enabling natural human-robot interaction. 2023-07-11
Robotics#AI#Robotics#GestureRecognition
A Convolutional Neural Network trained on a large dataset achieved 90.54% accuracy in recognizing handwritten text! 2023-07-11
Computer Vision and Pattern Recognition#OCR#AI#HandwritingRecognition
CIBL balances class frequencies in long-tailed image classification, improving performance across all classes. 2023-07-11
Computer Vision and Pattern Recognition#MachineLearning#DataImbalance#DeepNeuralNetworks
New approach widens decision-focused learning, enabling prediction of distributions over parameters, tackling stochastic optimization problems. 2023-07-11
Machine Learning#MachineLearning#Optimization#DataScience
Scientists have developed an advanced algorithm, PointCAM, for learning point cloud representations, boosting performance in 3D data analysis. 2023-07-11
Computer Vision and Pattern Recognition#AI#3D#DataAnalysis
New dataset and model for autonomous vehicle safety in complex scenarios, featuring pedestrian crossing and overtaking. 2023-07-11
Computer Vision and Pattern Recognition#TrajectoryPrediction#AutonomousVehicles#Safety
Energy attacks on battery-less IoT devices can be mitigated, allowing for longer application execution and increased peripheral availability. 2023-07-11
Cryptography and Security#IoTsecurity#EnergyMitigation#DevicePerformance
New bio-inspired algorithm enhances brightness, contrast, and reduces noise in nighttime images. Outperforms existing methods. 2023-07-11
Computer Vision and Pattern Recognition#ImageEnhancement#NightVision#BioInspired
Large-scale neural networks in machine vision sacrifice interpretability for accuracy, hindering our understanding of their inner workings. 2023-07-11
Computer Vision and Pattern Recognition#AI#MachineVision#Interpretability
*/

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-start gap-4 p-4">
      {papers.map((paper, index) => (
        <PaperCard key={index}>{paper.text}</PaperCard>
      ))}
    </main>
  );
}
