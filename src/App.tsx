import appleStock, {AppleStock} from "@visx/mock-data/lib/mocks/appleStock";
import useMeasure from "react-use-measure";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Bar } from "@visx/shape";
import { timeFormat } from "d3-time-format";
import moment from "moment";

const data = appleStock.slice(0, 10);

const margin = 32;

const defaultWidth = 100;
const defaultHeight = 100;

const getXValue = (d: AppleStock) => d.date;
const getYValue = (d: AppleStock) => d.close;

function App() {
  const [ref, bounds] = useMeasure();

  const width = bounds.width || defaultWidth;
  const height = bounds.height || defaultHeight;

  const innerWidth = width - margin * 2;
  const innerHeight = height - margin * 2;

  const xScale = scaleBand<string>({
    range: [margin, innerWidth],
    domain: data.map(getXValue),
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    range: [innerHeight, margin],
    domain: [
      Math.min(...data.map(getYValue)) - 1,
      Math.max(...data.map(getYValue)) + 1,
    ],
  });

  return (
    <svg 
    ref={ref} 
    width="100%" 
    height="100%"
    >
      <Group>
        {data.map((d) => {
          const xValue = getXValue(d);
          const barWidth = xScale.bandwidth();
          const barHeight = innerHeight - (yScale(getYValue(d)) ?? 0);
          const barX = xScale(xValue);
          const barY = innerHeight - barHeight;
          return (
            <Bar 
              key={`bar-${xValue}`}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="orange"
            />
          )
        })}
      </Group>
      <Group>
        <AxisLeft left={margin} scale={yScale} />
      </Group>
      <Group>
        <AxisBottom top={innerHeight} 
        scale={xScale} 
        tickFormat={(d) => moment(d).format('DD MMM YY')}
        />
      </Group>
    </svg>
  );
}

export default App;
