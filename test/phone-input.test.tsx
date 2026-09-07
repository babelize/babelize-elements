import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { PhoneInput, COUNTRIES } from "@/registry/components";

describe("PhoneInput", () => {
  it("defaults to the US dial code", () => {
    render(<PhoneInput />);
    expect(screen.getByText("+1")).toBeInTheDocument();
  });

  it("honours defaultCountry", () => {
    render(<PhoneInput defaultCountry="IN" />);
    expect(screen.getByText("+91")).toBeInTheDocument();
  });

  it("reports the number and the selected country on typing", async () => {
    const onValueChange = vi.fn();
    render(<PhoneInput onValueChange={onValueChange} />);

    await userEvent.type(screen.getByRole("textbox"), "5");

    expect(onValueChange).toHaveBeenCalledWith("5", expect.objectContaining({ code: "US" }));
  });

  it("follows an externally changed value prop (controlled mode)", async () => {
    function Harness() {
      const [value, setValue] = React.useState("111");
      return (
        <>
          <button type="button" onClick={() => setValue("222")}>
            set
          </button>
          <PhoneInput value={value} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole("textbox")).toHaveValue("111");

    await userEvent.click(screen.getByRole("button", { name: "set" }));
    expect(screen.getByRole("textbox")).toHaveValue("222");
  });

  it("still accepts the deprecated onChange and showFlag props", async () => {
    const onChange = vi.fn();
    render(<PhoneInput onChange={onChange} showFlag={false} />);

    await userEvent.type(screen.getByRole("textbox"), "7");

    expect(onChange).toHaveBeenCalledWith("7", expect.objectContaining({ code: "US" }));
    expect(screen.queryByText(COUNTRIES[0].flag)).not.toBeInTheDocument();
  });

  it("forwards a ref to the underlying input and accepts a name", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<PhoneInput ref={ref} name="phone" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "phone");
  });

  it("exposes a searchable country listbox", async () => {
    render(<PhoneInput />);
    await userEvent.click(screen.getByRole("button", { name: "Select country" }));

    const listbox = screen.getByRole("listbox");
    expect(listbox).toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText(/search/i), "Germ");
    expect(screen.getByRole("option", { name: /Germany/ })).toBeInTheDocument();
  });
});
