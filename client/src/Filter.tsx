import { useSearchParams } from "react-router-dom";
import Checklist from "./components/Checklist";
import { useTypesFetch, ValueProcessor, Sorter } from "./hooks/useTypesFetch";
import Utils from "./Utils";

function updateSearchParams(
  rawSearchParams: ReturnType<typeof useSearchParams>,
  updater: (params: URLSearchParams) => void
) {
  rawSearchParams[1]((oldParams) => {
    updater(oldParams);
    return oldParams;
  });
}

export function createChecklist(
  category: string,
  id: string,
  rawSearchParams: ReturnType<typeof useSearchParams>,
  valueProcessor?: ValueProcessor,
  sorter?: Sorter
): ReturnType<typeof Checklist> {
  const [searchParams] = rawSearchParams;
  const [types, hasTypes] = useTypesFetch(category, id, valueProcessor, sorter);
  const name = Utils.displayString(id) + ": ";
  const values = () =>
    (JSON.parse(searchParams.get(id) as string) as string[]) ?? [];
  return (
    <Checklist
      title={name + (values().length > 0 ? values().join(", ") : "Any")}
      values={hasTypes ? types : undefined}
      checkedValues={new Set(values())}
      onSelect={(selected) =>
        updateSearchParams(rawSearchParams, (oldParams) => {
          const newValues = values();
          newValues.push(selected);
          oldParams.set(id, JSON.stringify(newValues));
        })
      }
      onRemove={(removed) =>
        updateSearchParams(rawSearchParams, (oldParams) => {
          const newValues = values();
          newValues.splice(newValues.indexOf(removed), 1);
          if (newValues.length > 0) {
            oldParams.set(id, JSON.stringify(newValues));
          }
          else {
            oldParams.delete(id)
          }
        })
      }
    />
  );
}

export interface StringParams {
  a: string;
  b: string;
}

export interface StringArrayParams {
  level: string[];
  school: string[];
  source: string[];
  casting_time: string[];
  spell_lists: string[];
  duration: string[];
  range: string[];
  components: string[];
}

export default class Filter implements StringParams, StringArrayParams {
  a: string = "";
  b: string = "";
  level: string[] = [];
  school: string[] = [];
  source: string[] = [];
  casting_time: string[] = [];
  spell_lists: string[] = [];
  duration: string[] = [];
  range: string[] = [];
  components: string[] = [];

  public static buildParams(filter: Filter): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filter)) {
      params.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
    }
    return params;
  }
}
