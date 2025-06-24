import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function QuizScreen() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchQuiz = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/generate`);
      const data = await res.json();
      if (Array.isArray(data.questions)) {
        console.log('Received questions:', data.questions);
        setQuestions(data.questions);
      } else {
        setQuestions(data);
        console.log('Received questions:', data);
      }
    } catch (err) {
      console.error(err);
      return (
        <View style={styles.container}>
          <Text style={styles.errorTitle}>⚠️ Oops!</Text>
          <Text style={styles.errorMessage}>An error occurred: {error}</Text>
          <Text style={styles.errorSuggestion}>Please try again later.</Text>
          <TouchableOpacity style={styles.resetButton} onPress={fetchQuiz}>
            <Text style={styles.resetText}>Retry</Text>
          </TouchableOpacity>
        </View>
    );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, []);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[current].correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (current + 1 < questions.length) {
          setCurrent((prev) => prev + 1);
        } else {
          setFinished(true);
        }
        setSelected(null);
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }, 800);
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    fadeAnim.setValue(1);
    fetchQuiz();
  };

  const progressWidth = questions.length
    ? ((current + 1) / questions.length) * (SCREEN_WIDTH - 40)
    : 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#5A67D8" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={fetchQuiz}>
          <Text style={styles.resetText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    let message = "Keep going!";
    if (percent === 100) message = "Perfect! 🎉";
    else if (percent >= 70) message = "Great job! 👍";
    else if (percent >= 50) message = "Not bad! 💪";

    return (
      <View style={styles.container}>
        <Text style={styles.resultTitle}>✅ Quiz Completed</Text>
        <Text style={styles.score}>You scored {score}/{questions.length} ({percent}%)</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}>
          <Text style={styles.resetText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressBarFill, { width: progressWidth }]} />
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.question}>
          {current + 1}. {questions[current].question}
        </Text>

        {questions[current].options.map((opt: string, idx: number) => {
          let bg = '#5A67D8';
          if (selected !== null) {
            if (idx === questions[current].correct) bg = '#48BB78';
            else if (idx === selected) bg = '#F56565';
            else bg = '#CBD5E0';
          }
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.optionButton, { backgroundColor: bg }]}
              onPress={() => handleAnswer(idx)}
              disabled={selected !== null}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

        {selected !== null && (
          <Text style={styles.feedback}>
            {selected === questions[current].correct ? "✅ Correct!" : "❌ Wrong"}
          </Text>
        )}

        <Text style={styles.progressText}>
          Question {current + 1} of {questions.length}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#F7FAFC',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 25,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5A67D8',
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#2D3748',
  },
  optionButton: {
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  feedback: {
    textAlign: 'center',
    marginTop: 15,
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  progressText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#718096',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D3748',
    textAlign: 'center',
  },
  score: {
    fontSize: 24,
    marginTop: 20,
    textAlign: 'center',
    color: '#2D3748',
    fontWeight: '600',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    color: '#4A5568',
  },
  resetButton: {
    marginTop: 40,
    backgroundColor: '#5A67D8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  error: {
    fontSize: 18,
    color: '#E53E3E',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorTitle: {
  fontSize: 26,
  fontWeight: '700',
  color: '#E53E3E',
  textAlign: 'center',
  marginBottom: 10,
},
errorMessage: {
  fontSize: 18,
  color: '#E53E3E',
  textAlign: 'center',
  marginBottom: 8,
},
errorSuggestion: {
  fontSize: 16,
  color: '#4A5568',
  textAlign: 'center',
  marginBottom: 20,
},

});
