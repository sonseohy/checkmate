package com.checkmate.domain.naverNews.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class NewsResponse {
    private String lastBuildDate;
    private int total;
    private int start;
    private int display;
    private List<Item> items;

    @Data
    public static class Item {
        private String title;
        @JsonProperty("originallink")
        private String originalLink;
        private String link;
        private String description;
        @JsonProperty("pubDate")
        private String pubDate;
    }
}