import { Input } from "antd";
import { useState } from "react";
import { readHistory } from "../../utils/readHistory";
export default function InputSub(): JSX.Element {
  const [value, setValue] = useState("pics");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addHistory(event: any, value: string) {
    event.preventDefault();
    try {
      const history = await readHistory();
      if (!history) {
        localStorage.setItem("history", JSON.stringify([value]));
      } else {
        const newHistory = [value, ...history];
        localStorage.setItem("history", JSON.stringify(newHistory));
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Input.Search
      addonBefore={"r/"}
      defaultValue={value}
      onChange={(event) => setValue(event.target.value)}
      onSearch={(value, event) => addHistory(event, value)}
    />
  );
}
