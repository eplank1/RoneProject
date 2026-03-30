import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Line, Path, Text as SvgText } from 'react-native-svg';

type Point = { x: number; y: number };

type Props = {
  title: string;
  unit: string;
  data: Point[];
};

export function GraphCard({ title, unit, data }: Props) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(280, width - 56);
  const chartHeight = 180;
  const padding = 28;

  const xMax = Math.max(...data.map((d) => d.x), 1);
  const yMax = Math.max(...data.map((d) => d.y), 1);

  const toX = (value: number) => padding + (value / xMax) * (chartWidth - padding * 2);
  const toY = (value: number) => chartHeight - padding - (value / yMax) * (chartHeight - padding * 2);

  const path = data
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${toX(point.x)} ${toY(point.y)}`)
    .join(' ');

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.caption}>Cumulative intake over race time ({unit})</Text>
      <Svg width={chartWidth} height={chartHeight}>
        <Line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#9ca3af" strokeWidth="1" />
        <Line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#9ca3af" strokeWidth="1" />
        <Path d={path} stroke="#2563eb" strokeWidth="3" fill="none" />
        <SvgText x={padding} y={16} fontSize="11" fill="#6b7280">{yMax} {unit}</SvgText>
        <SvgText x={chartWidth - padding - 40} y={chartHeight - 8} fontSize="11" fill="#6b7280">{xMax} h</SvgText>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  caption: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 8,
  },
});
