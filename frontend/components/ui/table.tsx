// components/ui/table.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/use-app-theme";

type Column = {
  key: string;
  title: string;
  flex?: number; // default = 1
};

type Row = {
  [key: string]: React.ReactNode;
};

type TableProps = {
  columns: Column[];
  data: Row[];
};

export default function Table({ columns, data }: TableProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.table}>
      {/* Header */}
      <View style={styles.rowHeader}>
        {columns.map((col, index) => (
          <View
            key={col.key}
            style={[
              styles.cell,
              { flex: col.flex ?? 1 },
              index !== columns.length - 1 && styles.borderRight,
            ]}
          >
            <Text style={styles.headerText}>{col.title}</Text>
          </View>
        ))}
      </View>

      {/* Rows */}
      {data.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {columns.map((col, colIndex) => (
            <View
              key={col.key}
              style={[
                styles.cell,
                { flex: col.flex ?? 1 },
                colIndex !== columns.length - 1 && styles.borderRight,
              ]}
            >
              {typeof row[col.key] === "string" ||
              typeof row[col.key] === "number" ? (
                <Text style={styles.cellText}>{row[col.key]}</Text>
              ) : (
                row[col.key]
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    table: {
      borderWidth: 1,
      borderBottomWidth: 0,
      borderColor: theme.text,
      marginBottom: 20,
    },

    rowHeader: {
      flexDirection: "row",
      backgroundColor: theme.hoverBackground,
      borderBottomWidth: 1,
      borderColor: theme.text,
    },

    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderColor: theme.text,
    },

    cell: {
      padding: 12,
      justifyContent: "center",
    },

    borderRight: {
      borderRightWidth: 1,
      borderColor: theme.text,
    },

    headerText: {
      fontFamily: "Lato_700Bold",
      textAlign: "center",
      color: theme.text,
    },

    cellText: {
      fontFamily: "Lato_400Regular",
      textAlign: "center",
      color: theme.blackText,
    },
  });
