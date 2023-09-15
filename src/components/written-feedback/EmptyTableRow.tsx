export default function EmptyTableRow() {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-6" colSpan={4}>
        Sorry, it seems like all written feedback requests have already been claimed.
      </td>
    </tr>
  );
}
