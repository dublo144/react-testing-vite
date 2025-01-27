import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should render no images when no imageUrls are provided", () => {
    // Arrange
    const imageUrls: string[] = [];

    // Act
    const { container } = render(<ProductImageGallery imageUrls={imageUrls} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("should render a list of images when imageUrls are provided", () => {
    // Arrange
    const imageUrls: string[] = ["someUrl", "someOtherUrl"];

    // Act
    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole("img");

    // Assert
    expect(images).toHaveLength(imageUrls.length);
    images.forEach((image, index) => {
      expect(image).toHaveAttribute("src", imageUrls[index]);
    });
  });
});
